Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :maps, only: [:index, :create, :destroy, :update, :show]
      get '/map/:id', to: 'maps#show_icd'
      get '/map/:id/:ebene', to: 'maps#show_layer'

      resources :layers, only: [:index, :create, :show, :destroy, :update]
      get '/all/layers', to: 'layers#index_images'

      resources :icds, only: [:index, :create, :show, :destroy, :update]

      get :search_de, controller: :search
      get :search_fr, controller: :search
      get :search_it, controller: :search
      get :searchAll_de, controller: :search
      get :searchAll_fr, controller: :search
      get :searchAll_it, controller: :search

      resources :chapter, only: [ :index, :show]
    end
  end
  root 'homepage#index'
end
