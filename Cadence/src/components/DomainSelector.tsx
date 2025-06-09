import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from 'lucide-react';
import { DataDomain, dataDomains } from '@/lib/types/dataTypes';

interface DomainSelectorProps {
  onDomainSelect: (domain: DataDomain) => void;
}

export const DomainSelector = ({ onDomainSelect }: DomainSelectorProps) => {
  const [selectedDomain, setSelectedDomain] = useState<DataDomain>('general');

  const handleDomainChange = (value: DataDomain) => {
    setSelectedDomain(value);
    onDomainSelect(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={selectedDomain} onValueChange={handleDomainChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select data domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Choose Data Domain</SelectLabel>
              {Object.entries(dataDomains).map(([domain, info]) => (
                <SelectItem key={domain} value={domain as DataDomain}>
                  <div className="flex items-center space-x-2">
                    <span>{info.name.charAt(0).toUpperCase() + info.name.slice(1)}</span>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">{info.description}</h4>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-1">Common Metrics</h5>
                            <div className="flex flex-wrap gap-1">
                              {info.commonMetrics.map((metric: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium mb-1">Common Columns</h5>
                            <div className="flex flex-wrap gap-1">
                              {info.commonColumns.map((column: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {column}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium mb-1">Common Challenges</h5>
                            <ul className="text-xs text-gray-500 list-disc list-inside">
                              {info.commonChallenges.map((challenge: string, index: number) => (
                                <li key={index}>{challenge}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm text-gray-500">
        Analysis will be optimized for {dataDomains[selectedDomain].description.toLowerCase()}
      </div>
    </div>
  );
}; 