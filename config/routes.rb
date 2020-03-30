Rails.application.routes.draw do
  resources :layers, :except => [:show]
  get 'layers/:ebene/:id', to: 'layers#show'
  get 'layers/:ebene', to: 'layers#showEbene'
  root 'homepage#index'
  resources :icds
  get :search, controller: :search
  get '/chapter/:kapitel', to: 'chapter#show'
  get '/chapter', to: 'chapter#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
