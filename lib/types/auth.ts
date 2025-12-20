export interface RegisterRequest {
  name: string;
  username: string; // Email address
  password: string;
}

export interface User {
  id: number;
  name: string;
  username: string; // Email address
  is_active?: boolean;
  memberships?: UserMembership[];
}

export interface UserMembership {
  org_id: number;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UserRole {
  id: number;
  key: string; // e.g., "OWNER", "ADMIN", "MEMBER"
  permissions: string[]; // e.g., ["org.manage_members", ...]
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>[];
}

export interface RegisterResponse {
  success: boolean;
  data?: User;
  error?: ApiError;
}

export interface LoginRequest {
  username: string; // Email address
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string; // "bearer"
}

export interface LoginResponse {
  success: boolean;
  data?: AuthTokens;
  error?: ApiError;
}

export interface Organization {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface CreateOrgRequest {
  name: string;
  email: string;
}

export interface OrganizationsResponse {
  success: boolean;
  data: Organization[];
  error?: ApiError;
}

export interface CreateOrgResponse {
  success: boolean;
  data?: Organization;
  error?: ApiError;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  org_id: number;
  created_by: number;
  organization?: Organization;
  created_by_user?: User;
}

export interface CreateProductRequest {
  name: string;
  description: string;
}

export interface ProductsResponse {
  success: boolean;
  data?: Product[];
  error?: ApiError;
}

export interface CreateProductResponse {
  success: boolean;
  data?: Product;
  error?: ApiError;
}

export interface Feedback {
  id: number;
  title: string;
  description: string;
  org_id: number;
  product_id: number;
  created_by: number;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  votes?: number;
}

export interface CreateFeedbackRequest {
  title: string;
  description: string;
}

export interface FeedbackResponse {
  success: boolean;
  data?: Feedback[];
  error?: ApiError;
}

export interface CreateFeedbackResponse {
  success: boolean;
  data?: Feedback;
  error?: ApiError;
}

export interface OrgMember {
  user: User;
  role_id: number;
  status: 'ACTIVE' | 'INACTIVE';
  joined_at: string;
}

export interface OrgMembersResponse {
  success: boolean;
  data?: OrgMember[];
  error?: ApiError;
}

export interface VoteResponse {
  success: boolean;
  data?: string; 
  error?: ApiError;
}