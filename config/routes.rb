Rails.application.routes.draw do
  root 'homepage#index'
  resources :icds
  get :search, controller: :search
  get '/chapter/:kapitel', to: 'chapter#show'
  get '/chapter', to: 'chapter#index'
  resources :ear_elements
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
