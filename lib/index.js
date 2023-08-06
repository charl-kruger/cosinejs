"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosine = void 0;
function cosine(vecA, vecsB, n) {
    // Compute the magnitude of vecA once
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const results = vecsB.map(vecB => {
        if (vecA.length !== vecB.length) {
            throw new Error('Vectors must have the same dimensions');
        }
        const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        const similarity = dotProduct / (magnitudeA * magnitudeB);
        return { vector: vecB, similarity };
    });
    return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, n);
}
exports.cosine = cosine;
