import React from 'react';
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
import { DataDomain, domainMetadata } from '@/lib/types/dataTypes';

interface DomainSelectorProps {
  selectedDomain: DataDomain;
  onDomainChange: (domain: DataDomain) => void;
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  selectedDomain,
  onDomainChange,
}) => {
  const handleValueChange = (value: string) => {
    onDomainChange(value as DataDomain);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={selectedDomain} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select data domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Choose Data Domain</SelectLabel>
              {Object.entries(domainMetadata).map(([key, domain]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">{domain.name}</span>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InfoIcon className="h-4 w-4 text-gray-400" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">{domain.description}</h4>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-1">Common Metrics</h5>
                            <div className="flex flex-wrap gap-1">
                              {domain.commonMetrics.map((metric, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium mb-1">Typical Columns</h5>
                            <div className="flex flex-wrap gap-1">
                              {domain.typicalColumns.map((column, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {column}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium mb-1">Special Considerations</h5>
                            <ul className="text-xs text-gray-500 list-disc list-inside">
                              {domain.specialConsiderations.map((consideration, index) => (
                                <li key={index}>{consideration}</li>
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

      {selectedDomain !== 'auto_detect' && (
        <div className="text-sm text-gray-500">
          Analysis will be optimized for {domainMetadata[selectedDomain].description.toLowerCase()}
        </div>
      )}
    </div>
  );
}; 