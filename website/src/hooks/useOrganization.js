import organization from 'src/config/organization';

export default function useOrganization() {
  return organization?.id ? organization : null;
}
