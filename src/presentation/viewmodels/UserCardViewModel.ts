import { BaseViewModel } from './BaseViewModel';

// 1. Define the unified data structure
export interface UserData {
    title: string;
    username: string;
    status: 'online' | 'offline';
    id: number;
    name: string;
    email: string;
    companyName: string;
    isEditing: boolean;
    isSaving: boolean;
}

export class UserCardViewModel extends BaseViewModel<UserData> {

    constructor(initialData: UserData) {
        super(initialData);

        // Register internal handlers to external event names
        this.registerEvent('toggleEdit', this.handleToggleEdit);
        this.registerEvent('saveChanges', this.handleSaveChanges);
    }

    public override onMount(): void {
        console.log('UserCardViewModel mounted');
    }

    public override onUnmount(): void {
        console.log('UserCardViewModel unmounted');
    }

    // --- Private Handlers (Mapped in Constructor) ---

    private handleToggleEdit = () => {
        this.setData({ isEditing: !this.data.isEditing });
    };

    private handleSaveChanges = (newName: string) => {
        // Prevent double save
        if (this.data.isSaving) return;

        this.setData({ isSaving: true });

        // Simulate async save logic
        setTimeout(() => {
            this.setData({
                name: newName,
                isEditing: false,
                isSaving: false
            });
        }, 1000);
    };
}