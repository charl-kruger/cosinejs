# Cosine Similarity Calculator

This module provides a simple and efficient way to calculate the cosine similarity between a given vector and an array of vectors. It's particularly useful for tasks like recommendation systems or other machine learning applications where you need to determine similarity between sets of items.

## Installation

Install the package using npm:

```bash
npm install cosinejs
```

## Usage

Here's an example of how you can use the `cosine` function from this module:

```javascript
import { cosine } from 'cosinejs';

const vecA = [1, 2, 3];
const vecsB = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

const results = cosine(vecA, vecsB, 2);

console.log(results);
```

## Release Notes

### Version 1.0.2

Optimizations:
- Improved the efficiency of the cosine function by computing the magnitude of the primary vector (vecA) just once, resulting in a significant performance boost especially for high-dimensional vectors.

### API

#### `cosine(vecA: number[], vecsB: number[][], n: number): { vector: number[], similarity: number }[]`

Calculates the cosine similarity between `vecA` and each vector in `vecsB`, and returns the top `n` results.

- `vecA`: A vector represented as an array of numbers.
- `vecsB`: An array of vectors, each represented as an array of numbers.
- `n`: The number of top results to return.

**Note**: Vectors must have the same dimensions, or an error will be thrown.

## Storing Vectors with Cloudflare KV and Durable Objects

This module can also be used in conjunction with Cloudflare's KV and Durable Objects for efficient storage and retrieval of vectors. Here's how you can do that:

### Using Cloudflare Durable Objects

Durable Objects provide a way to manage state within the Cloudflare Workers runtime. This can be useful for more complex scenarios where vectors are part of an object's state.

Here's an example of how you might use Durable Objects:

array-storage.ts
```typescript
export class ArrayStorageDO {
    state: DurableObjectState;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
    }

    async fetch(request: Request) {
        let url = new URL(request.url);

        switch (url.pathname) {
            case "/store":
                const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
                await this.state.storage?.put("array", array);
                return new Response("Array stored successfully");
            case "/get":
                const storedArray: number[][] = await this.state.storage?.get("array") || [];
                return new Response(JSON.stringify(storedArray), {
                    headers: { "Content-Type": "application/json" }
                });
            default:
                return new Response("Not found", { status: 404 });
        }
    }

    async getStoredArray(): Promise<number[][]> {
        return await this.state.storage?.get("array") || [];
    }
}

interface Env {
    ARRAY_STORAGE: DurableObjectNamespace;
}
```

index.ts
```typescript
import { ArrayStorageDO } from './array-storage';
import { cosine } from 'cosinejs';

export { ArrayStorageDO };

export default {
    async fetch(request: Request, env: Env) {
        try {
            return await handleRequest(request, env);
        } catch (e) {
            return new Response(`${e}`);
        }
    },
};

async function handleRequest(request: Request, env: Env) {
    let url = new URL(request.url);
    let name = url.searchParams.get("name");

    if (!name) {
        return new Response(
            "Select a Durable Object to contact by using the `name` URL query string parameter. e.g. ?name=ArrayStorage"
        );
    }

    let id = env.ARRAY_STORAGE.idFromName(name);
    let obj = env.ARRAY_STORAGE.get(id);

    if (url.pathname === "/cosine-search") {
        if (request.method !== "POST") {
            return new Response("Expected POST request", { status: 400 });
        }

        const inputData = await request.json();
        const userVector = inputData.vector;

        if (!userVector || !Array.isArray(userVector)) {
            return new Response("Invalid input vector", { status: 400 });
        }

        const storedVectors: number[][] = await obj.getStoredArray();
        const results = cosine(userVector, storedVectors, 2);

        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    }

    return obj.fetch(request);
}
```

## Contributing

If you find any bugs or have suggestions for improvements, please submit an issue or pull request.

## License

[MIT](LICENSE.md)
