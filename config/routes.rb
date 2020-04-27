Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :maps, only: [:index, :create, :destroy, :update]
      get '/maps/:id/:ebene', to: 'maps#show'
      resources :layers
      resources :icds, only: [:index, :create, :show, :destroy, :update]
      get :search, controller: :search
      get :searchAll, controller: :search
      resources :chapter, only: [ :index, :show]
    end
  end
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
