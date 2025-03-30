
export interface SaveTagRequest {
  id?: number;
  name: string;
}


export interface TagDTO {
  id: number;
  name: string;
  userId?: number;
}


export interface SubscriberSearchDTO {
  keyword?: string
  tagId?: string
  page: number
  size: number
  sort?: string
}

export interface SubscriberDTO {
  id: number,
  userId: number,
  email: string,
  firstName: string,
  lastName: string | null | any,
  status: "ACTIVE" | "INACTIVE",
  createdAt: string
}


export interface SubscriberResponseDTO {
  content: SubscriberDTO[],
  totalElements: number
}


export interface SaveSubscriberRequest {
  id?: number;
  email: string;
  firstName: string;
  lastName?: string;
  tagIds: number[];
}
