class Api::V1::LayersController < ApplicationController

  def index
    render json: Layer.all.order(id: :asc)
  end

  def index_images
    render json: Layer.all.select('ROW_NUMBER() OVER (ORDER BY ebene) as id, ebene, count(ebene)').group('ebene').order(ebene: :asc)
  end

  def show
    layer = Layer.find(params[:id])
    render json: layer
  end

  def create
    layer = Layer.create(layer_params)
    render json: layer
  end

  def update
    layer = Layer.find(params[:id])
    layer.update(layer_params)
    render json: layer
  end

  def destroy
    Layer.destroy(params[:id])
  end

  private

  def layer_params
    params.require(:layer).permit(:ebene, :name, :img)
  end
end
