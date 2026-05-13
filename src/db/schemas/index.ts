import * as auth from "./auth";

export const schema = {
	...auth.tables,
};

export const relations = {
	...auth.relations,
};
