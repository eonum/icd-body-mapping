class Api::V1::SearchController < ApplicationController

  before_action only: :search

  def index; end

  def search_de
    icd = Icd.ransack(code_or_text_de_cont: params[:q]).result(distinct: true).order(code: :asc).limit(20)
    render json: icd
  end

  def search_fr
    icd = Icd.ransack(code_or_text_fr_cont: params[:q]).result(distinct: true).order(code: :asc).limit(20)
    render json: icd
  end

  def search_it
    icd = Icd.ransack(code_or_text_it_cont: params[:q]).result(distinct: true).order(code: :asc).limit(20)
    render json: icd
  end

  def searchAll_de
    icd = Icd.ransack(code_or_text_de_cont: params[:q]).result(distinct: true).order(code: :asc)
    render json: icd
  end

  def searchAll_fr
    icd = Icd.ransack(code_or_text_fr_cont: params[:q]).result(distinct: true).order(code: :asc)
    render json: icd
  end

  def searchAll_it
    icd = Icd.ransack(code_or_text_it_cont: params[:q]).result(distinct: true).order(code: :asc)
    render json: icd
  end

  private

end
