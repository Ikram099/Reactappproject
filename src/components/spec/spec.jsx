import React, { useEffect, useState } from 'react';
import { getProductSpecifications } from './servicenow';
import './spec.css';
import defaultProductImage from '../../assets/default-product.png';

const ProductSpecifications = () => {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSearchTerm, setAiSearchTerm] = useState('');
  const [aiResults, setAiResults] = useState([]);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Configuration API
  const API_CONFIG = {
    endpoints: {
      specifications: getProductSpecifications,
      aiSearch: "https://dev268291.service-now.com/api/sn_prd_pm/ai_search_proxy2/search"
    },
    headers: {
      "Authorization": "Basic " + btoa("admin:K5F/Uj/lDbo9"),
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductSpecifications();
        setSpecs(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredSpecs = specs.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAiSearch = async () => {
    if (!aiSearchTerm.trim()) return;
    
    setIsAiSearching(true);
    try {
      const response = await fetch(
        `${API_CONFIG.endpoints.aiSearch}?term=${encodeURIComponent(aiSearchTerm)}`,
        { headers: API_CONFIG.headers }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAiResults(data.result?.result?.items || data.result?.items || data.result || []);
    } catch (err) {
      console.error("AI Search error:", err);
      setAiResults([]);
      setError("Erreur lors de la recherche AI");
    } finally {
      setIsAiSearching(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Chargement des spécifications...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">Erreur: {error}</p>
    </div>
  );

  return (
    <div className="product-specs-container p-6">
      <h1 className="text-2xl font-bold mb-6">Product Specifications</h1>
      
      {/* Barre de recherche principale */}
      <div className="search-container mb-6">
        <input
          type="text"
          placeholder="Rechercher des spécifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Liste des produits */}
      <main className="specs-container">
        {filteredSpecs.length === 0 ? (
          <div className="no-results text-center py-10">
            <p className="text-gray-500">Aucune spécification trouvée</p>
          </div>
        ) : (
          <div className="specs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecs.map((spec) => (
              <div key={spec.sys_id} className="spec-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="spec-image-container h-48 overflow-hidden">
                  <img 
                    src={spec.image_url || defaultProductImage} 
                    alt={spec.display_name}
                    className="spec-image w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = defaultProductImage;
                    }}
                  />
                </div>
                <div className="spec-details p-4">
                  <h3 className="spec-name text-lg font-semibold mb-2">{spec.display_name}</h3>
                  <p className="spec-id text-sm text-gray-500 mb-3">Réf: {spec.name}</p>
                  <div className="spec-attributes space-y-2">
                    {spec.attributes && Object.entries(spec.attributes).map(([key, value]) => (
                      <div key={key} className="attribute flex justify-between">
                        <span className="attribute-key font-medium text-gray-700">{key}:</span>
                        <span className="attribute-value text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="view-details-button w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors">
                  Voir détails
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Section Recherche AI */}
      <div className="ai-search-section mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Recherche Intelligente</h2>
        <p className="mb-4 text-gray-600">Posez vos questions sur nos produits et spécifications</p>
        
        <div className="ai-search-container flex gap-2">
          <input
            type="text"
            placeholder="Ex: Quelles sont les spécifications pour la fibre optique?"
            value={aiSearchTerm}
            onChange={(e) => setAiSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAiSearch()}
            className="ai-search-input flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAiSearch}
            disabled={isAiSearching}
            className="ai-search-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isAiSearching ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </div>

        {isAiSearching && (
          <div className="ai-loading text-center py-6">
            <div className="spinner inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Analyse en cours...</p>
          </div>
        )}

        {aiResults.length > 0 && (
          <div className="ai-results mt-6">
            <h3 className="text-lg font-semibold mb-4">Résultats de la recherche</h3>
            <div className="ai-results-grid grid gap-4">
              {aiResults.map((result, index) => (
                <div key={index} className="ai-result-card bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium text-blue-600 mb-2">{result.title || 'Résultat sans titre'}</h4>
                  <p className="text-gray-700 mb-3">{result.summary || result.description || 'Aucun détail disponible'}</p>
                  {result.link && (
                    <a 
                      href={result.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ai-result-link text-blue-500 hover:underline inline-block"
                    >
                      En savoir plus
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isAiSearching && aiSearchTerm && aiResults.length === 0 && (
          <div className="ai-no-results text-center py-6">
            <p className="text-gray-500">Aucun résultat trouvé pour "{aiSearchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;