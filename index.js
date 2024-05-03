function Merge(a, low, mid, high) {
    let h = low;
    let i = low
    let j = mid + 1;
    let b = []
    while ((h <= mid) && (j <= high)) {

        if (a[h] <= a[j]) {

            b[i] = a[h];
             h = h + 1;

        } else {

            b[i] = a[j]; j = j + 1;

        }

        i = i + 1;

    }

    if (h > mid) {

        for (let k = j; k < high; k++) {

            b[i] = a[k];
            i = i + 1;

        }

    } else {

        for (let k = h; k < mid; k++) {

            b[i] = a[k]; i = i + 1;

        }

    }

    for (let k = low; k < high; k++) {

        a[k] = b[k];

    }
    return a;

}

console.log(Merge([
    2, 4, 5, 6,
    7, 3, 8, 9
  ], 1, 4, 8))