require 'rails_helper'

RSpec.describe Api::V1::MapsController, type: :controller do

  before(:all) do
    @icd1 = FactoryBot.create(:icd)
    @icd2 = FactoryBot.create(:icd)
    @lay1 = FactoryBot.create(:layer)
    @lay2 = FactoryBot.create(:layer)
    @map1 = FactoryBot.create(:map)
    @map2 = FactoryBot.create(:map)
  end

  describe "GET index" do
    it 'should show all maps' do
      get :index
      expect(response.body).to match [@map1,@map2].to_json
    end
  end

  describe "GET show" do
    it 'should show map' do
      get :show, params: {id: 1}
      expect(response.body).to match [@map1].to_json
    end

    it 'should not show all maps' do
      get :show, params: {id: 1}
      expect(response.body).to_not equal [@map1,@map2].to_json
    end

    it 'should show layers' do
      get :show_icd, params: {id: 1}
      expect(response.body).to match [@lay1, @lay2].to_json
    end
  end

  describe "DELETE destroy" do
    let!(:icd) { create :icd }
    let!(:layer) { create :layer }
    let!(:map) { create :map }

    it 'should delete layer' do
      expect { delete :destroy, params: { id: map.id } }.to change(Map, :count).by(-1)
    end
  end

  context 'POST create' do
    let!(:icd) { create :icd }
    let!(:layer) { create :layer }
    let!(:map) { create :map }

    it 'should create a new map' do
      params = [{icd_id: icd.id, layer_id: layer.id}]
      expect { post(:create, params: { maps_list: params }) }.to change(Map, :count).by(1)
    end

    it 'should create two maps' do
      params = [{icd_id: @icd2.id, layer_id: @lay1.id},
                {icd_id: @icd2.id, layer_id: @lay2.id}]
      expect { post(:create, params: { maps_list: params }) }.to change(Map, :count).by(2)
    end
  end
end