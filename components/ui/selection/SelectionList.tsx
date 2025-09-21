import React from 'react';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Card } from '../display/Card';

export interface SelectionItem {
  id: string;
  title: string;
  description?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface SelectionListProps {
  items: SelectionItem[];
  onItemPress: (itemId: string) => void;
  multiSelect?: boolean;
  title?: string;
  emptyMessage?: string;
}

export const SelectionList: React.FC<SelectionListProps> = ({
  items,
  onItemPress,
  multiSelect = true,
  title,
  emptyMessage = 'No items available',
}) => {
  if (items.length === 0) {
    return (
      <Box paddingVertical="xl" alignItems="center">
        <Text variant="body" color="textMuted" textAlign="center">
          {emptyMessage}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Text 
          variant="h2" 
          color="text" 
          marginBottom="l"
        >
          {title}
        </Text>
      )}
      
      <Box>
        {items.map((item, index) => (
          <Box key={item.id} marginBottom="s">
            <Card
              variant="default"
              padding="l"
              onPress={() => !item.isDisabled && onItemPress(item.id)}
              disabled={item.isDisabled}
              backgroundColor={item.isSelected ? 'surface' : 'background'}
              borderWidth={1}
              borderColor={item.isSelected ? 'primary' : 'transparent'}
              borderRadius="s"
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box flex={1} marginRight="l">
                  <Text
                    variant="body"
                    color={item.isSelected ? 'text' : 'text'}
                    marginBottom={item.description ? 'xs' : undefined}
                  >
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text 
                      variant="caption" 
                      color="textMuted" 
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  )}
                </Box>
                
                {/* Minimal selection indicator */}
                <Box
                  width={16}
                  height={16}
                  borderRadius={multiSelect ? 's' : 'round'}
                  borderWidth={1}
                  borderColor={item.isSelected ? 'primary' : 'border'}
                  backgroundColor={item.isSelected ? 'primary' : 'transparent'}
                  alignItems="center"
                  justifyContent="center"
                >
                  {item.isSelected && (
                    <Box
                      width={multiSelect ? 6 : 8}
                      height={multiSelect ? 6 : 8}
                      borderRadius={multiSelect ? 'xs' : 'round'}
                      backgroundColor="white"
                    />
                  )}
                </Box>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SelectionList;
