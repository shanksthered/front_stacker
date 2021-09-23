import React, { useEffect, useState } from 'react';
import FavoritesManager from '../../Services/RailsApi/FavoritesFetch';
import CompanyPreview from '../CompaniesResults/CompanyPreview';

const FavoritesCompanies = () => {
  
  const [companies, setCompanies] = useState("")

  useEffect(() => {
    getFavoriteCompanies()
  }, []);

  const getFavoriteCompanies = async() => {
    const response = await FavoritesManager.getCompaniesByUser()
    setCompanies(response.data)
  }
  return (
    <div>
      {companies && companies.map((company) => (
        <li key={company.id} className="item">
          <CompanyPreview company={company.data}/>
        </li>
      ))}
    </div>
  );
}

export default FavoritesCompanies;
