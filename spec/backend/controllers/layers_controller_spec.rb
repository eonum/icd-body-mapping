require 'rails_helper'

RSpec.describe Api::V1::LayersController, type: :controller do

  before(:all) do
    @lay1 = FactoryBot.create(:layer)
    @lay2 = FactoryBot.create(:layer)
  end

  describe "GET index" do
    it 'should show all Layers' do
      get :index
      expect(response.body).to match [@lay1,@lay2].to_json
    end
  end

  describe "GET show" do
    it 'should show layer' do
      get :show, params: {id: @lay1.id}
      expect(response.body).to match [@lay1].to_json
    end

    it 'should not show all Layers' do
      get :show, params: {id: @lay1.id}
      expect(response.body).to_not equal [@lay1,@lay2].to_json
    end
  end

  context 'POST create' do
    let!(:layer) { create :layer }

    it 'should create a new layer' do
      params = {
          name: 'Ohr',
          ebene: 'Ohr',
          img: './test'
      }
      expect { post(:create, params: { layer: params }) }.to change(Layer, :count).by(1)
    end
  end

  describe "DELETE destroy" do
    let!(:layer) { create :layer }

    it 'should delete layer' do
      expect { delete :destroy, params: { id: layer.id } }.to change(Layer, :count).by(-1)
    end
  end
end