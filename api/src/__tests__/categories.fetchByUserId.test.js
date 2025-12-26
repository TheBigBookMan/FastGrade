import httpMocks from "node-mocks-http";
import categoryController from "../controllers/categoryController.js";
import categoryService from "../services/categoryService.js";
import { vi } from "vitest";

vi.mock("../services/categoryService.js");

describe("fetchCategoriesByUserId (unit)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns categories for a valid userId", async () => {
        const mockCategories = [
            { id: "cat-1", name: "Work", order: 1 },
            { id: "cat-2", name: "Personal", order: 2 },
        ];

        categoryService.getCategoriesByUserId.mockResolvedValue(mockCategories);

        const req = httpMocks.createRequest({
            params: { userId: "user-123" },
            query: {},
        });

        const res = httpMocks.createResponse();

        await categoryController.fetchCategoriesByUserId(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data).toEqual(mockCategories);
    });
});
