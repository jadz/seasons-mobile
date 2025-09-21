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
        <Text variant="body" color="text/secondary" textAlign="center">
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
          color="text/primary" 
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
              onPress={() => !item.isDisabled && onItemPress(item.id)}
              disabled={item.isDisabled}
            >
              <Box
                backgroundColor={item.isSelected ? 'primaryDark' : 'surface'}
                borderRadius="l"
                borderWidth={1}
                borderColor={item.isSelected ? 'primary' : 'border'}
                paddingHorizontal="xl"
                paddingVertical="l"
                opacity={item.isDisabled ? 0.4 : 1}
              >
                <Box flexDirection="row" alignItems="center">
                  <Box flex={1}>
                    <Text
                      variant={item.isSelected ? 'bodySemiBold' : 'body'}
                      color={item.isSelected ? 'white' : 'text'}
                      marginBottom={item.description ? 'xs' : undefined}
                    >
                      {item.title}
                    </Text>
                    {item.description && (
                      <Text 
                        variant="body" 
                        color={item.isSelected ? 'textInverse' : 'textMuted'} 
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    )}
                  </Box>
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
