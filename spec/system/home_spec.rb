require 'rails_helper'

RSpec.describe 'Topbar', type: :system do
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
  describe 'LayerList' do
    def self.boot
      instance = new
      Capybara::Server.new(instance).tap { |server| server.boot }
    end
    it 'should enter Edit Layers' do
      sleep(10)
      click_button 'enter edit mode'
      click_button 'Edit Layers'
    end
  end
end