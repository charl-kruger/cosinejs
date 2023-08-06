import { expect, test } from 'vitest'
import {cosine} from "./lib";

test('cosine similarity of vectors', () => {
    const vecA = [1, 2, 3];
    const vecsB = [
        [1, 2, 3],
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1]
    ];
    const n = 2;

    const result = cosine(vecA, vecsB, n);

    // The first vector in vecsB is identical to vecA, so it should have a similarity of 1.
    // The fourth vector [1,1,1] should be the second closest to vecA.
    // Hence, the top 2 vectors based on similarity should be the first and fourth vectors.
    expect(result[0].similarity).toBeCloseTo(1);
    expect(result[0].vector).toEqual([1, 2, 3]);
    expect(result[1].vector).toEqual([1, 1, 1]);
});

test('throws error when vectors have different dimensions', () => {
    const vecA = [1, 2];
    const vecsB = [[1, 2, 3]];

    expect(() => {
        cosine(vecA, vecsB, 1);
    }).toThrow('Vectors must have the same dimensions');
});
