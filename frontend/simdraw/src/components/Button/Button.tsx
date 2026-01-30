import './button.css'
import React from 'react'; 
 
export interface IButtonProps { 
    children: React.ReactNode; 
    variant?: 'primary' | 'secondary' | 'danger'; 
    size?: 'sm' | 'md' | 'lg'; 
    disabled?: boolean; 
    loading?: boolean; 
    onClick?: () => void; 
    type?: 'button' | 'submit' | 'reset'; 
}

export const Button: React.FC<IButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    loading = false, 
    onClick, 
    type = 'button', 
}) => {
/** 
    const baseClasses = 'font-semibold rounded-lg transition-colors'; 
    
    const variantClasses = { 
        primary: 'bg-blue-600 text-white hover:bg-blue-700', 
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300', 
        danger: 'bg-red-600 text-white hover:bg-red-700', 
    }; 
    
    const sizeClasses = { 
        sm: 'px-3 py-1.5 text-sm', 
        md: 'px-4 py-2 text-base', 
        lg: 'px-6 py-3 text-lg', 
    };

    const classes = `${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} 
    `.trim();
*/
    return ( 
        <button 
        type={type}
        className='submit-button'
        //className={classes}
        disabled={disabled || loading} 
        onClick={onClick} 
        //aria-busy={loading} 
        > 
        {loading ? 'Loading...' : children} 
        </button> 
    ); 
}; 

export default Button