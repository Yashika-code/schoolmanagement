import createCrudSlice from "../../utils/createCrudSlice.js";

const { reducer, thunks } = createCrudSlice({ name: "subjects", endpoint: "/api/subjects" });

export const fetchSubjects = thunks.fetchItems;
export const createSubject = thunks.createItem;
export const updateSubject = thunks.updateItem;
export const deleteSubject = thunks.deleteItem;

export default reducer;
