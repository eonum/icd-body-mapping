require 'rails_helper'

RSpec.describe 'Buttons_Fields', type: :system do
  before(:each) do
    visit root_path
  end

  describe 'index page' do
    it 'shows ICD Mapping' do
      expect(page).to have_content('ICD Mapping')
    end
  end

  describe 'search' do
    it 'should fill in search' do
      fill_in 'Search...', with: 'A00'
    end
  end

  describe 'Edit Mode' do
    it 'should enter Edit Mode' do
      click_button 'enter edit mode'
    end
  end
end