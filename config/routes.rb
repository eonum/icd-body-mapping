Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :maps, only: [:index, :create, :destroy, :update]
      get '/maps/:id/:ebene', to: 'maps#show'
    end
  end
  resources :layers
  resources :icds
  get :search, controller: :search
  resources :chapter, only: [ :index, :show]
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
