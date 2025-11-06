import React, { useState } from 'react';
import { useViewModel } from '../../../hooks/useViewModel';
import { ProductViewModel } from '../../../viewmodels/ProductViewModel';

interface ProductViewProps {
    viewModel: ProductViewModel;
}

const ProductView: React.FC<ProductViewProps> = ({ viewModel }) => {
    const data = useViewModel(viewModel);

    return (
        <div>
            <h3>Products</h3>
            {data.isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {data.products.map(product => (
                        <li key={product.id}>
                            {product.name} ({product.category})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductView;
