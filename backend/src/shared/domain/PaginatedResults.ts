export interface PaginatedResults<T> {
	results: T[];
	count: number;
	totalPages: number;
}
