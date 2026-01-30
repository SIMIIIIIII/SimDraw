import './SearchForm.css'
import React from 'react';
import { useNavigate, type NavigateFunction } from 'react-router-dom';

interface ISearchFormProps{
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
}

export const SearchForm = ({
    children,
    loading = false,
    disabled = false
} : ISearchFormProps) => {

    const navigate : NavigateFunction = useNavigate();

    const onSearch = (e: React.FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();
    
        const form = e.currentTarget;
        const searchTerm : string = (form.elements.namedItem('recherche') as HTMLInputElement).value;
    
        navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        window.location.reload();
      };

    return (
        <div className="formulaire">
            <form className="form-control" onSubmit={onSearch}>
                <label htmlFor="search"><h2>Recherche</h2></label>
                <input
                    type="search"
                    placeholder="Champs de recherche"
                    id="search"
                />
                <input
                    type="submit"
                    value={loading ? 'Loading...' : children!}
                    disabled={disabled || loading} 
                />
            </form>
          </div>
    )

}