import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function InvestmentFilters() {
  const countries = ['Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Tanzania', 'Egypt'];
  const sectors = ['Agriculture', 'Technology', 'Real Estate', 'Finance', 'Other'];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map(country => (
            <SelectItem key={country} value={country}>{country}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Sector" />
        </SelectTrigger>
        <SelectContent>
          {sectors.map(sector => (
            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
