require 'rails_helper'

RSpec.describe Api::V1::IcdsController, type: :controller do

  before(:all) do
    @icd1 = FactoryBot.create(:icd)
    @icd2 = FactoryBot.create(:icd)
  end

  describe "GET index" do
    it 'should show all Icds' do
      get :index
      expect(response.body).to match [@icd1,@icd2].to_json
    end
  end

  describe "GET show" do
    it 'should show Icd' do
      get :show, params: {id: @icd1.id}
      expect(response.body).to match [@icd1].to_json
    end

    it 'should not show all Icds' do
      get :show, params: {id: @icd1.id}
      expect(response.body).to_not equal [@icd1,@icd2].to_json
    end
  end

  describe "PUT update" do
    let!(:icd) { create :icd }

    it 'should update Icd' do
      params = {
          code: "A00",
          text_de: "Anything",
          text_fr: "Anything",
          text_it: "Anything",
          annotationen: "Test",
          kapitel: "1",
          code_kapitel: "A00-B00",
          kapitel_name_de: "Anything",
          kapitel_name_fr: "Anything",
          kapitel_name_it: "Anything",
          kapitel_roemisch: "I"
      }

      put :update, params: { id: icd.id, icd: params }
      icd.reload
      params.keys.each do |key|
        expect(icd.attributes[key.to_s].to_s).to eq params[key]
      end
    end
  end
end