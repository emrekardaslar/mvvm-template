import React, { useState } from 'react';
import { useViewModel } from '../../../hooks/useViewModel';
import { ProductViewModel } from '../../../viewmodels/ProductViewModel';

interface ProductViewProps {
    initialData: ReturnType<ProductViewModel['getData']>;
}

const ProductView: React.FC<ProductViewProps> = ({ initialData }) => {
    const [viewModel] = useState(() => new ProductViewModel(initialData));
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
