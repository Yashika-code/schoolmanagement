import createCrudSlice from "../../utils/createCrudSlice.js";

const { reducer, thunks } = createCrudSlice({ name: "classes", endpoint: "/api/classes" });

export const fetchClasses = thunks.fetchItems;
export const createClass = thunks.createItem;
export const updateClass = thunks.updateItem;
export const deleteClass = thunks.deleteItem;

export default reducer;
