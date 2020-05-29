require 'rails_helper'

RSpec.describe Api::V1::SearchController, type: :controller do

  before(:all) do
    @created_icds = FactoryBot.create_list(:icd, 30)
    @test_icds = FactoryBot.create(:icd, :de)
    @test_icds = FactoryBot.create(:icd, :it)
  end

  describe "GET search" do
    it 'should get 20 de icds' do
      get :search_de, params: {}
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq 20
    end
    it 'should get 20 fr icds' do
      get :search_fr, params: {}
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq 20
    end
    it 'should get 20 it icds' do
      get :search_it, params: {}
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq 20
    end

    it 'should return a single de icd' do
      params = { q: "test" }
      get :search_de, params: params
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq 1
    end

    it 'should not return a single fr icd' do
      params = { q: "test" }
      get :search_fr, params: params
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq 0
    end

    it 'should return a single it icd' do
      params = { q: "test" }
      get :search_it, params: params
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq 1
    end
  end

  describe "GET searchAll" do
    it 'should get all icds' do
      get :searchAll_de, params: {}
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq @created_icds.length+2
    end
    it 'should get all icds' do
      get :searchAll_fr, params: {}
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq @created_icds.length+2
    end
    it 'should get all icds' do
      get :searchAll_it, params: {}
      antwort = JSON.parse(response.body)
      expect(antwort.length).to eq @created_icds.length+2
    end
  end
end