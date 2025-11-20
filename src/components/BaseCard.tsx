import React, { Component, type ReactNode, type CSSProperties } from 'react';

// Export the Base State so the Child can extend it
export interface BaseState {
    isOpen: boolean;
}

export interface BaseCardProps {
    title?: string;
}

// Ensure the class accepts generic state that extends BaseState
class BaseCard<P extends BaseCardProps = BaseCardProps, S extends BaseState = BaseState> extends Component<P, S> {

    constructor(props: P) {
        super(props);
        this.state = {
            isOpen: true, // Default shared state
        } as S;
    }

    // Shared Functional Logic (Inherited Method)
    toggleCard = (): void => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen
        } as unknown as Pick<S, keyof S>));
    };

    // --- Structural Methods (Template Pattern) ---

    render() {
        // Structural logic uses inherited functional state
        const { isOpen } = this.state;

        return (
            <div style={this.containerStyle}>
                <div style={this.headerStyle}>
                    {this.renderHeader()}
                </div>

                <div style={this.bodyStyle}>
                    {/* Body and Footer only render if open */}
                    {isOpen && this.renderBody()}
                    {isOpen && this.renderFooter()}
                </div>
            </div>
        );
    }

    // Default Implementations (Overridable by Children)
    renderHeader(): ReactNode {
        return <h3 style={{ margin: 0 }}>{this.props.title || 'Base Card'}</h3>;
    }

    renderBody(): ReactNode {
        return <p>Default body content...</p>;
    }

    renderFooter(): ReactNode {
        return <small>Base Card Footer</small>;
    }

    // Styles (getters remain the same)
    get containerStyle(): CSSProperties {
        return { border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', fontFamily: 'sans-serif' };
    }
    get headerStyle(): CSSProperties {
        return { background: '#f4f4f4', padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    }
    get bodyStyle(): CSSProperties {
        return { padding: '20px' };
    }
}

export default BaseCard;