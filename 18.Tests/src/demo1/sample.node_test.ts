import { describe, test } from "node:test";
import { add } from "./sample.ts";
import assert from "node:assert";

describe("Sample test", () => {
    test("should add two numbers correctly", () => {
        const result = add(2, 3);
        // Add your assertions here
        assert.strictEqual(result, 5);
    });
});
