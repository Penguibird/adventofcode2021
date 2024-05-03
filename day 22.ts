import { fstat, open, readFileSync, writeFileSync, writeSync } from "fs";
import { OutgoingMessage } from "http";
import { posix } from "path/posix";
import { addListener } from "process";
import { arrayBuffer } from "stream/consumers";
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str: string | RegExp, newStr: any) {

        // If a regex pattern
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);

    };
}
import * as v8 from 'v8';

const structuredClone = (obj: any) => {
    return v8.deserialize(v8.serialize(obj));
};

declare global {
    interface Array<T> {
        dedupe(): Array<T>;
    }
}

Object.defineProperty(Array.prototype, "dedupe", {
    enumerable: false, writable: false,
    value: function () {
        return Array.from(new Set<string>(this.map(_ => JSON.stringify(_)))).map(_ => JSON.parse(_))
    }
})

const combinations = <T>(array: T[]) => array.flatMap(
    (v, i) => array.slice(i + 1).map(w => [v, w] as [T, T])
);
type Point = [number, number, number]

class Cube {
    constructor(public on: boolean, public points: [Point, Point]) { }

    public getArea() {
        const distances = [0, 0, 0].map((_, i) => Math.abs(this.points[0][i] - this.points[1][i]))
        return distances.reduce((a, v) => a * v, 1);
    }

    public containsPoint(p: Point) {
        return [0, 0, 0]
            .map((n, i) => p[i] > this.points[0][i] && p[i] < this.points[1][i])
            .reduce((a, v) => a && v, true)
    }

    public containsLine(points: [Point, Point]) {
        const coordToReplaceIndex = [0, 0, 0].findIndex((n, i) => points[0][i] != points[1][i])
        return this.containsPoint(points[0].map((n, i) => i == coordToReplaceIndex ? this.points[0][coordToReplaceIndex] + 0.5 : n) as Point)
        || this.containsPoint(points[0].map((n, i) => i == coordToReplaceIndex ? this.points[0][coordToReplaceIndex] - 0.5 : n) as Point)
    }

    public containsPlane(points: [Point, Point]) {
        const i = [0, 0, 0].findIndex((n, i) => points[0][i] == points[1][i])
        const planeLevel = points[0][i];
        return planeLevel >= this.points[0][i] && planeLevel <= this.points[1][i]
    }

    public containsCube(c: Cube) {
        return this.containsPoint(c.points[0]) && this.containsPoint(c.points[1])
    }

    public getAllVertices(): Point[] {
        let vertices: Point[]
        for (let i = 0; i < 8; i++) {
            let keyToChoosePoints = i.toString(2).split("").map(n => parseInt(n));
            while (keyToChoosePoints.length < 3) keyToChoosePoints = [0, ...keyToChoosePoints];
            vertices.push([0, 0, 0].map((n, i) => this.points[keyToChoosePoints[i]][i]) as Point);
        }
        return vertices;
    }

    public getAllEdges(): [Point, Point][] {
        const allLines = combinations(this.getAllVertices())
        return allLines.filter(line => [0, 0, 0].filter((n, i) => line[0][i] != line[1][i]).length == 1)
    }
    public getAllPlanes(): [Point, Point][] {
        const allLines = combinations(this.getAllVertices())
        return allLines.filter(line => [0, 0, 0].filter((n, i) => line[0][i] != line[1][i]).length == 2)
    }
    
}



const cubes: Cube[] = readFileSync("input2.txt")
    .toString()
    .split('\n')
    .map(line => line
        .split(" ")
    )
    .map(([onOff, rangesInput]) => {
        const ranges = rangesInput.split(",")
            .map(range => range
                .split("=")[1]
                .split("..")
                .map(n => parseInt(n))
                .map(n => n + 50) as [number, number]
            ) as [number, number][]
        const points = [0, 1].map(n => ranges.map(range => range[n]) as Point) as [Point, Point]
        return new Cube(onOff == "on", points)
    })
    .filter((cube) => cube.points.flat().every(point => point > -100 && point < 100))
    ;

for (const cube1 of cubes) {
    for (const cube2 of cubes) {
        const point = cube2.getAllVertices().find(vertex => cube1.containsPoint(vertex))
        if (point) {
            // Create 8 new cubes
            cube1.getAllVertices().forEach(vertex => cubes.push(new Cube(true, [vertex, point])))
            continue;
        }
        const edge = cube2.getAllEdges().find(edge => cube1.containsLine(edge))
        if (edge) {
            
            continue;
        }
        const plane = cube2.getAllPlanes().find(plane => cube1.containsPlane(plane))
        if (plane) {

            continue;
        }
    }
}

console.log()