import createCrudSlice from "../../utils/createCrudSlice.js";

const { reducer, thunks } = createCrudSlice({ name: "teachers", endpoint: "/api/teachers" });

export const fetchTeachers = thunks.fetchItems;
export const createTeacher = thunks.createItem;
export const updateTeacher = thunks.updateItem;
export const deleteTeacher = thunks.deleteItem;

export default reducer;
