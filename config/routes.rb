Rails.application.routes.draw do
  resources :icds
  root 'homepage#index'
  get :search, controller: :search
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
