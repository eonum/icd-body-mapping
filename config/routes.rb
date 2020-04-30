Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :maps, only: [:index, :create, :destroy, :update]
      get '/maps/:id/:ebene', to: 'maps#show'
      resources :layers, only: [:index, :create, :show, :destroy, :update]
      resources :icds, only: [:index, :create, :show, :destroy, :update]
      get :search, controller: :search
      get :searchAll, controller: :search
      resources :chapter, only: [ :index, :show]
    end
  end
  root 'homepage#index'
end
