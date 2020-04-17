class Api::V1::MapsController < ApplicationController
  def index
    render json: Map.all
  end

  def create
    map = Map.create(map_params)
    render json: map
  end

  def show
    map = Layer.joins(:maps).select("layers.*, maps.icd_id").where("maps.icd_id = ? AND layers.ebene = ?", params[:id], params[:ebene])
    render json: map
  end

  def destroy
    Map.destroy(params[:id])
  end

  def update
    map = Map.find(params[:id])
    map.update_attributes(map_params)
    render json: map
  end

  private

  def map_params
    params.require(:map).permit(:id, :icd_id, :layer_id)
  end
end