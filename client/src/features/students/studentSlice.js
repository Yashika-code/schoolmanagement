import createCrudSlice from "../../utils/createCrudSlice.js";

const { reducer, thunks } = createCrudSlice({ name: "students", endpoint: "/api/students" });

export const fetchStudents = thunks.fetchItems;
export const createStudent = thunks.createItem;
export const updateStudent = thunks.updateItem;
export const deleteStudent = thunks.deleteItem;

export default reducer;
