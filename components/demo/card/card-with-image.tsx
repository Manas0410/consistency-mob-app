import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { View } from '@/components/ui/view';
import React from 'react';
import { Image } from 'react-native';


export function CardWithImage({ title,
  description,
  imageUrl,
  onClick }: any) {
  return (
    <Card>
      <View style={{ borderRadius: 26, overflow: 'hidden', marginBottom: 16 }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: 300 }}
          resizeMode='cover'
        />
      </View>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>
          {description}
        </CardDescription>}
      </CardHeader>
      {/* { <CardContent>
        <Text>
          This image showcases the beauty of nature with its vibrant colors and
          serene atmosphere.
        </Text>
      </CardContent>} */}
      <CardFooter>
        <Button onPress={onClick}>View</Button>
      </CardFooter>
    </Card>
  );
}
