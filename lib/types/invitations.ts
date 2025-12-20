// Invitation types for API integration

export interface InvitationCreate {
  email: string;
  role_id?: number;
  role_name?: string;
}

export interface InvitationRead {
  invited_at: string | number | Date;
  id: number;
  email: string;
  org_id: number;
  org_name: string;
  role_id?: number;
  role_name?: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  created_at: string;
  expires_at: string;
}

export interface InvitationResponse {
  success: boolean;
  data?: InvitationRead;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>[];
  };
}

export interface PendingInvitationsResponse {
  success: boolean;
  data?: InvitationRead[];
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>[];
  };
}