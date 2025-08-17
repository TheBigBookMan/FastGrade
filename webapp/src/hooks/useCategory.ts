import { useMutation } from "@tanstack/react-query";
import categoryService from "../services/categoryService";
import { CategoryData } from "../types/categoryTypes";

export const useCreateCategory = () => {
    return useMutation({mutationFn: (data: CategoryData) => categoryService.createCategory(data)});
}