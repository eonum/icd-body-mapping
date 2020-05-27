require 'capybara_helper'

RSpec.describe 'LayerOptions', js: true do
  before(:all) do
    DatabaseCleaner.clean_with(:truncation)
    @icd = FactoryBot.create(:icd)
    @layer = FactoryBot.create(:layer)
  end
  before(:each) do
    visit root_path
  end

  describe 'add/view Layers' do
    it 'should create new Layer' do
      click_button 'enter edit mode'
      click_button 'Edit Layers'
      click_button 'add new image'
      fill_in 'Enter the layer E.g. Ohr', with: "Test"
      fill_in 'Enter the name E.g. Auricula', with: "Test"
      fill_in 'Enter the image url', with: "Test"
      click_button 'Submit'
    end
    it 'should open Layer' do
      click_button 'enter edit mode'
      click_button 'Edit Layers'
      find('button.btn.btn-default.p-0.m-0.shadow-none.text-primary').click
    end
  end

  describe 'Navigate' do
    it 'should go forward and back in Hierarchy' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('a.btn.btn-light.p-0.mb-1').click
      find('h1', text: 'A01')
    end
    it 'should search for code' do
      fill_in 'Search...', with: 'A01'
      find('a', text: 'View Details').click
      find('h1', text: 'A01')
    end
    it 'should close search' do
      fill_in 'Search...', with: 'A01'
      click_button 'closeSearch'
      expect(page).not_to have_content('Anything')
    end
  end

  describe 'Details Card' do
    it 'should close icd' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('button.btn.btn-default.btn-sm.text-right.text-white.ml-4').click
    end
    it 'should have save in edit mode' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      click_button 'enter edit mode'
      click_button 'Save'
    end
    it 'should save annotationen' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      click_button 'enter edit mode'
      fill_in 'Annotationen', with: 'Something'
      click_button 'Save'
      find('button.btn.btn-default.btn-sm.text-right.text-white.ml-4').click
      find('span', text: 'Anything').click
      click_button 'exit edit mode'
      find('div.border-top', text:'Something')
    end
  end
  describe 'Language' do
    it 'should change Language' do
      click_button 'de'
      find('div.dropdown-item', text:'fr').click
      click_button 'fr'
    end
  end

  describe 'Mapping' do
    it 'should switch layers' do
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      find('button', text:'Ebene1')
    end
    it 'should select image' do
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      find('button', text:'Ebene1')
      find('img', id:'Ohr').click
    end
  end

  describe 'LayerList' do
    it 'should select/unselect Fragment' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('a.btn.btn-light.p-0.mb-1').click
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      click_button 'enter edit mode'
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none', text:'Ohr').click
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none.text-primary.font-weight-bold.bg-light', text:'Ohr').click
    end
    it 'should Not select Fragment outside of edit Mode' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('a.btn.btn-light.p-0.mb-1').click
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none', text:'Ohr').click
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none', text:'Ohr').click
    end
    it 'should unselect on save' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('a.btn.btn-light.p-0.mb-1').click
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none', text:'Ohr').click
      click_button 'enter edit mode'
      click_button 'Save'
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none', text:'Ohr').click
    end
    it 'should Open/close Layerlist' do
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      find('button.btn.btn-default.p-0.m-0.shadow-none.text-primary').click
      expect(page).not_to have_content('Ohr')
      find('button.btn.btn-default.p-0.m-0.shadow-none.text-primary').click
      expect(page).to have_content('Ohr')
    end
  end

  describe 'Reset UI' do
    it 'should reset Search' do
      fill_in 'Search...', with: 'A01'
      click_button 'ICD Mapping'
      fill_in 'Search...', with: 'A01'
    end
    it 'should reset Sidebar' do
      find('span', text: 'A00-B00').click
      click_button 'ICD Mapping'
      find('span', text: 'A00-B00').click
    end
    it 'should reset Layerlist' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('a.btn.btn-light.p-0.mb-1').click
      find('button', text:'Gehirn Längsschnitt').click
      find('div.dropdown-item', text:'Ebene1').click
      click_button 'enter edit mode'
      find('div.list-group-item.list-group-item-action.p-0.pl-2.shadow-none', text:'Ohr').click
      click_button 'ICD Mapping'
      expect(page).not_to have_content('Ohr')
    end
    it 'should reset Edit Mode' do
      click_button 'enter edit mode'
      click_button 'ICD Mapping'
      click_button 'enter edit mode'
    end
    it 'should reset DetailsCard' do
      find('span', text: 'A00-B00').click
      find('span', text: 'Anything').click
      find('h1', text: 'A01')
      click_button 'ICD Mapping'
      expect(page).not_to have_content('A01')
    end
  end

  after(:all) do
    DatabaseCleaner.clean
  end
end