package com.clinica.api.service;

import com.clinica.api.dto.request.ProdutoRequest;
import com.clinica.api.dto.response.AnvisaProdutoResponse;
import com.clinica.api.dto.response.ProdutoResponse;
import com.clinica.api.entity.Produto;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.LoteProdutoRepository;
import com.clinica.api.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final LoteProdutoRepository loteProdutoRepository;
    private final AnvisaService anvisaService;

    private Long getEmpresaId() {
        Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getEmpresaId();
    }

    public List<ProdutoResponse> listar(String busca) {
        Long empresaId = getEmpresaId();
        List<Produto> produtos;
        if (empresaId != null) {
            if (busca != null && !busca.isBlank()) {
                produtos = produtoRepository.findByEmpresaIdAndAtivoTrueAndNomeContainingIgnoreCase(empresaId, busca);
            } else {
                produtos = produtoRepository.findByEmpresaIdAndAtivoTrue(empresaId);
            }
        } else {
            produtos = (busca != null && !busca.isBlank())
                    ? produtoRepository.buscar(busca)
                    : produtoRepository.findByAtivoTrue();
        }
        return produtos.stream().map(this::toResponse).toList();
    }

    public ProdutoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ProdutoResponse criar(ProdutoRequest request) {
        Produto produto = Produto.builder()
                .nome(request.getNome())
                .fabricante(request.getFabricante())
                .categoria(request.getCategoria())
                .unidade(request.getUnidade())
                .registroAnvisa(request.getRegistroAnvisa())
                .descricao(request.getDescricao())
                .empresaId(getEmpresaId())
                .build();
        return toResponse(produtoRepository.save(produto));
    }

    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = findById(id);
        produto.setNome(request.getNome());
        produto.setFabricante(request.getFabricante());
        produto.setCategoria(request.getCategoria());
        produto.setUnidade(request.getUnidade());
        produto.setRegistroAnvisa(request.getRegistroAnvisa());
        produto.setDescricao(request.getDescricao());
        return toResponse(produtoRepository.save(produto));
    }

    @Transactional
    public void inativar(Long id) {
        Produto produto = findById(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    public Optional<AnvisaProdutoResponse> consultarAnvisa(Long id) {
        Produto produto = findById(id);
        if (produto.getRegistroAnvisa() == null || produto.getRegistroAnvisa().isBlank()) {
            return Optional.empty();
        }
        return anvisaService.consultarProduto(produto.getRegistroAnvisa());
    }

    private Produto findById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
    }

    private ProdutoResponse toResponse(Produto produto) {
        List<com.clinica.api.entity.LoteProduto> lotes = loteProdutoRepository.findByProdutoIdAndAtivoTrue(produto.getId());
        int estoqueTotal = lotes.stream().mapToInt(l -> l.getQuantidadeAtual()).sum();
        return ProdutoResponse.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .fabricante(produto.getFabricante())
                .categoria(produto.getCategoria())
                .unidade(produto.getUnidade())
                .registroAnvisa(produto.getRegistroAnvisa())
                .descricao(produto.getDescricao())
                .ativo(produto.isAtivo())
                .totalLotes(lotes.size())
                .estoqueTotal(estoqueTotal)
                .criadoEm(produto.getCriadoEm())
                .build();
    }
}
