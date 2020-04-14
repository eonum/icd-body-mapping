Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :maps
    end
  end
  resources :layers
  resources :icds
  get :search, controller: :search
  get '/chapter/:kapitel', to: 'chapter#show'
  get '/chapter', to: 'chapter#index'
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
