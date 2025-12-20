import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Organization } from '@/lib/types/auth';

interface OrganizationCardProps {
  organization: Organization;
  onClick: () => void;
}

export default function OrganizationCard({ organization, onClick }: OrganizationCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{organization.name}</h3>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3">{organization.email}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Products
          </div>
          <span className="text-blue-600 hover:text-blue-700 font-medium">
            View →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}