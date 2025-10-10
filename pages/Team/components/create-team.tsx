import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Plus, Users } from 'lucide-react-native';
import React from 'react';

export function AddTeam({ isVisible,  close }: { isVisible: boolean, close: () => void }) {

    const [loading, setLoading] = React.useState(false);

    return (
        <View>
            <BottomSheet
                isVisible={isVisible}
                onClose={close}
                snapPoints={[0.3, 0.6, 0.9]}
            >
                <View style={{ gap: 16 }}>
                    <Text variant='title'>Create new team</Text>
                    <Input label={"Team Name"} placeholder={"Enter Team Name"} icon={Users} />
                    <Button loading={loading} icon={Plus} variant='success' onPress={() => { setLoading(true) }}>Close</Button>
                </View>
            </BottomSheet>
        </View>
    );
}
