import React, { type ReactNode } from 'react';
import BaseCard, { type BaseState, type BaseCardProps } from './BaseCard';

// 1. Child State must extend BaseState
interface UserCardState extends BaseState {
    isHighlighted: boolean;
}

export interface User {
    name: string;
    email: string;
    company: {
        name: string;
    };
}

interface UserCardProps extends BaseCardProps {
    user: User;
}

class UserCard extends BaseCard<UserCardProps, UserCardState> {

    constructor(props: UserCardProps) {
        super(props);
        // Initialize State with inherited (isOpen) and specific (isHighlighted)
        this.state = {
            isOpen: true,
            isHighlighted: false
        };
    }

    // Specific Functional Logic (Child's own method)
    toggleHighlight = (): void => {
        this.setState(prev => ({ isHighlighted: !prev.isHighlighted }));
    }

    // --- Structural Overrides ---

    // OVERRIDE: Customize the Header
    renderHeader(): ReactNode {
        const { isHighlighted, isOpen } = this.state; // Access both states

        return (
            <>
                {/* Call the parent's structure to render the title */}
                {super.renderHeader()}

                <div style={{ display: 'flex', gap: '10px' }}>

                    {/* Use the Child's specific method */}
                    <button onClick={this.toggleHighlight}>
                        {isHighlighted ? 'Unhighlight' : 'Highlight'}
                    </button>

                    {/* Use the Inherited method */}
                    <button onClick={this.toggleCard}>
                        {isOpen ? 'Close' : 'Open'}
                    </button>
                </div>
            </>
        );
    }

    // OVERRIDE: Replace the Body
    renderBody(): ReactNode {
        return (
            <div>
                <p>Email: {this.props.user.email}</p>
                <p>Company: {this.props.user.company.name}</p>
            </div>
        );
    }

    // We leave renderFooter() to use the default implementation from BaseCard.
}

export default UserCard;